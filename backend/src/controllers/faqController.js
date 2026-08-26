// backend/src/controllers/faqController.js

import FAQ from '../models/FAQ.js';

// GET /faqs - public (also used by the admin FAQ list, which reads everything it needs from this)
export const getFAQs = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const items = await FAQ.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: { items } });
  } catch (error) {
    next(error);
  }
};

// GET /faqs/:id
export const getFAQById = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};

// POST /faqs - admin
export const createFAQ = async (req, res, next) => {
  try {
    const { question, answer, category, order, isActive } = req.body;
    const faq = new FAQ({ question, answer, category, order, isActive });
    await faq.save();
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /faqs/:id - admin
export const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    const { question, answer, category, order, isActive } = req.body;
    faq.question = question || faq.question;
    faq.answer = answer || faq.answer;
    faq.category = category || faq.category;
    faq.order = order !== undefined ? order : faq.order;
    faq.isActive = isActive !== undefined ? isActive : faq.isActive;
    await faq.save();
    res.json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /faqs/:id - admin
export const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    await faq.deleteOne();
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    next(error);
  }
};
