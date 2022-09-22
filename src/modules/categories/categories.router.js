import {categoriesService} from './categories.service.js'

export async function categoriesRouter(fastify, options) {
    fastify.get('/api/categories', getCategoryHandler)
    fastify.get('/api/categories/:id', getCategoriesHandler)
    fastify.post('/api/categories', createCategoryHandler)
    fastify.delete('/api/categories', deleteCategoryHandler)
}

async function getCategoryHandler(req, rep) {
    return categoriesService.getCategories()
}
async function getCategoriesHandler(req, rep) {

}
async function createCategoryHandler(req, rep) {
    return categoriesService.createCategory(req.body)
}
async function deleteCategoryHandler(req, rep) {
    return categoriesService.deleteCategory(req.query.id)
}
