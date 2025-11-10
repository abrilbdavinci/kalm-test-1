// controllers/bannersController.js
import Banner from '../models/Banner.js';

export async function listBanners(req, res) {
  try {
    const now = new Date();
    const { position } = req.query;
    let filter = { active: true };

    // filtrar por posición
    if (position) filter.position = position;

    // filtrar por fechas si existen
    filter.$or = [
      { startAt: { $exists: false }, endAt: { $exists: false } },
      { startAt: { $lte: now }, endAt: { $gte: now } },
      { startAt: { $lte: now }, endAt: { $exists: false } },
      { startAt: { $exists: false }, endAt: { $gte: now } }
    ];

    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    res.json(banners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching banners' });
  }
}

export async function getBanner(req, res) {
  try {
    const b = await Banner.findById(req.params.id);
    if (!b) return res.status(404).json({ error: 'Banner not found' });
    res.json(b);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching banner' });
  }
}

export async function createBanner(req, res) {
  try {
    const b = new Banner(req.body);
    await b.save();
    res.status(201).json(b);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateBanner(req, res) {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteBanner(req, res) {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting banner' });
  }
}
