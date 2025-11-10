// controllers/productsController.js
import Product from '../models/Product.js';
import User from '../models/User.js'; // si tenés un modelo User para obtener perfil; opcional

// listar productos con filtros/ paginación
export async function listProducts(req, res) {
  try {
    const { q, tag, category, minPrice, maxPrice, limit = 24, skip = 0 } = req.query;
    const filter = {};

    if (q) filter.$text = { $search: q }; // si indexaste texto
    if (tag) filter.tags = tag;
    if (category) filter.categories = category;
    if (minPrice) filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };

    const products = await Product.find(filter).skip(Number(skip)).limit(Number(limit)).lean();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching products' });
  }
}

export async function getProduct(req, res) {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product' });
  }
}

export async function createProduct(req, res) {
  try {
    const p = new Product(req.body);
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product' });
  }
}

/**
 * recommendedProducts
 * - puede recibir:
 *    - userId (en query) -> cargamos perfil del usuario y hacemos matching
 *    - o un objeto de perfil por query params: skinType, concerns, budget, preferredBrands
 * - devolvemos productos ordenados por score (match + popularity + rating)
 */
export async function recommendedProducts(req, res) {
  try {
    const { userId, skinType, concerns, budget, limit = 12 } = req.query;
    let profile = { skinType: null, concerns: [], preferredBrands: [] };

    if (userId) {
      const user = await User.findById(userId).lean();
      if (user) {
        profile.skinType = user.profile?.skinType || null;
        profile.concerns = user.profile?.concerns || [];
        profile.preferredBrands = user.profile?.preferredBrands || [];
      }
    } else {
      if (skinType) profile.skinType = skinType;
      if (req.query.concerns) profile.concerns = Array.isArray(req.query.concerns) ? req.query.concerns : String(req.query.concerns).split(',');
      if (req.query.preferredBrands) profile.preferredBrands = Array.isArray(req.query.preferredBrands) ? req.query.preferredBrands : String(req.query.preferredBrands).split(',');
    }

    // fetch candidate products (podés afinar por categorias/tags)
    const candidates = await Product.find({ available: true }).lean();

    // scoring básico: + matches por skinType, concerns, preferredBrands; + popularity and rating factor
    const scored = candidates.map(p => {
      let score = 0;

      // skinType match
      if (profile.skinType && p.skinTypes && p.skinTypes.includes(profile.skinType)) score += 30;

      // concerns (each match suma)
      if (Array.isArray(profile.concerns) && profile.concerns.length && p.concerns) {
        const matches = profile.concerns.filter(c => p.concerns.includes(c));
        score += Math.min(3, matches.length) * 15; // up to +45
      }

      // preferred brands
      if (Array.isArray(profile.preferredBrands) && profile.preferredBrands.length) {
        if (profile.preferredBrands.includes(p.brand)) score += 20;
      }

      // tags/ingredients match (small bonus)
      if (profile.concerns && p.ingredients) {
        const ingrMatches = (p.ingredients || []).filter(i => profile.concerns.includes(i) || profile.concerns.includes(i.toLowerCase()));
        score += Math.min(2, ingrMatches.length) * 5;
      }

      // popularity and rating scaled
      score += Math.min(20, (p.popularity || 0) / 100); // example scaling
      score += Math.min(10, (p.rating || 0) * 2); // rating 0-5 -> up to 10

      return { product: p, score };
    });

    // sort desc by score
    scored.sort((a, b) => b.score - a.score);

    // return top
    const top = scored.slice(0, Number(limit)).map(s => ({ ...s.product, _recommendScore: s.score }));
    res.json(top);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating recommendations' });
  }
}
