// controllers/storiesController.js
import Story from '../models/Story.js';

/* List active stories, optionally filter by audience query */ 
export async function listStories(req, res) {
  try {
    const { skinType, hairType, tag } = req.query;
    let filter = { active: true };

    if (skinType) filter['audience.skinTypes'] = skinType;
    if (hairType) filter['audience.hairTypes'] = hairType;
    if (tag) filter['audience.tags'] = tag;

    const stories = await Story.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching stories' });
  }
}

export async function getStory(req, res) {
  try {
    const s = await Story.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Story not found' });
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching story' });
  }
}

export async function createStory(req, res) {
  try {
    const payload = req.body;
    const story = new Story(payload);
    await story.save();
    res.status(201).json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateStory(req, res) {
  try {
    const updated = await Story.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Story not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteStory(req, res) {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting story' });
  }
}
