import {categoriesService} from './categories.service.js'

export async function categoriesRouter(fastify, options) {
    // fastify.addHook('onRequest', fastify.authenticate);
    // fastify.addHook('onRequest', fastify.admin);

    fastify.get('/api/categories', getCategoriesHandler)
    fastify.get('/api/categories/:id', getCategoryHandler)
    fastify.get('/api/categories/:category_id/posts', getPostsHandler)

    fastify.post('/api/categories', createCategoryHandler)

    fastify.patch('/api/categories/:id', updateCategoryHandler)

    fastify.delete('/api/categories/:id', deleteCategoryHandler)
}

async function getCategoryHandler(req, rep) {
    return categoriesService.getCategory(req.params.id)
}
async function getCategoriesHandler(req, rep) {
    return categoriesService.getCategories()
}
async function createCategoryHandler(req, rep) {
    return categoriesService.createCategory(req.body)
}
async function deleteCategoryHandler(req, rep) {
    return categoriesService.deleteCategory(req.query.id)
}
async function getPostsHandler(req, rep) {
    return categoriesService.getPostsWithCategory({id: req.params.category_id, status: req?.user?.role === 'ADMIN' ? undefined : 'ACTIVE'});
}
async function updateCategoryHandler(req, res) {
    return categoriesService.patchCategory(req.params.id, {title: req?.body?.title, description: req?.body?.description})
}