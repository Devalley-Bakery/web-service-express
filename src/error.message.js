export function createResponse(statusCode, message, data = undefined) {
    return { status: statusCode, message, data };
}

export const ERROR_MESSAGES = {
    employeeNotFound: `Employee not found.`,
    productNotFound: `Product not found.`,
    insufficientStock:  `Insufficient stock for this product.`,
    invalidStatus: "Invalid status.",
    orderNotFound: "Order not found.",
    orderUpdateError: "Order cannot be updated.",
};