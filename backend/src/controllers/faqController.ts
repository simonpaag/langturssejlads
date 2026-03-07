import { Request, Response, RequestHandler } from 'express';
import { prisma } from '../server';

interface AuthRequest extends Request {
    user?: any;
}

// Hent alle FAQ artikler
export const getFaqs: RequestHandler = async (req, res) => {
    try {
        const faqs = await prisma.faqArticle.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { order: 'asc' }
        });
        res.status(200).json(faqs);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
};

// Hent specifik FAQ via slug
export const getFaqBySlug: RequestHandler = async (req, res) => {
    try {
        const slug = req.params.slug as string;
        const faq = await prisma.faqArticle.findUnique({
            where: { slug }
        });

        if (!faq || faq.status === 'DRAFT') {
            res.status(404).json({ error: 'FAQ not found' });
            return;
        }
        res.status(200).json(faq);
    } catch (error) {
        console.error('Error fetching FAQ:', error);
        res.status(500).json({ error: 'Failed to fetch FAQ' });
    }
};

// Opret en ny FAQ (Kun Admin)
export const createFaq: RequestHandler = async (req, res) => {
    try {
        const { title, slug, content, imageUrl, status, order } = req.body;

        const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const faq = await prisma.faqArticle.create({
            data: {
                title,
                slug: finalSlug,
                content,
                imageUrl,
                status: status || 'PUBLISHED',
                order: order || 0
            }
        });
        res.status(201).json(faq);
    } catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({ error: 'Failed to create FAQ' });
    }
};

// Opdater en eksisterende FAQ
export const updateFaq: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id as string;
        const { title, slug, content, imageUrl, status, order } = req.body;

        const faq = await prisma.faqArticle.update({
            where: { id: parseInt(id) },
            data: { title, slug, content, imageUrl, status, order }
        });
        res.status(200).json(faq);
    } catch (error) {
        console.error('Error updating FAQ:', error);
        res.status(500).json({ error: 'Failed to update FAQ' });
    }
};

// Slet en FAQ
export const deleteFaq: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id as string;
        await prisma.faqArticle.delete({
            where: { id: parseInt(id) }
        });
        res.status(200).json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).json({ error: 'Failed to delete FAQ' });
    }
};
