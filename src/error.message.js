export function createResponse(statusCode, message, data = undefined) {
    return { status: statusCode, message, data };
}

export const ERROR_MESSAGES = {
    employeeNotFound: `Employee not found.`,
    productNotFound: `Product not found.`,
    insufficientStock:  `Insufficient stock for this product.`,
    invalidStatus: "Invalid status value.",
    orderNotFound: "Order not found.",
    orderUpdateError: "Order update error.",
    invalidProucts: "Invalid products",
    invalidEmployee: 'Invalid employees'

};