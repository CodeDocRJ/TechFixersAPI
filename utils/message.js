module.exports = {
    ERROR: {
        invalid: "Invalid credential",
        internalServerError: "Internal server error",
        invalidCode: "Invalid verification code",
        alreadAxists: "Already axists",
        invalidMobileLength: "Mobile number must be exactly 10 digits",
        notFound: "Not found",

        headers: {
            deniedToken: "Access denied. No token provided",
            blackListToken: "Token blacklisted. Please login again",
            accessDenied: "Access denied",
            adminAuth: "Access denied. Only admins are allowed to access this resource.",
            userAuth: "Access denied. Only users are allowed to access this resource.",
            techAuth: "Access denied. Only technicians are allowed to access this resource."
        },
    },
    user_name: {
        available: "Username available",
        userNameAlreadAxists: "Username already registered",
        emailAlreadAxists: "Email already registered",
        phoneAlreadAxists: "Phone already registered",
    },
    auth: {
        login: "Login successfully",
        getProfile: "Profile data retrieved successfully",
        updateProfile: "Profile updated successfully",
        logout: "Logout successfully",
    },
    ADMIN: {
        product_category: {
            alreadAxists: "Product category already axists",
            added: "Product category added successfully",
            update: "Product category updated successfully",
            delete: "Product category deleted successfully",
            list: "Product category list retrieved successfully",
            get: "Product category retrieved successfully",
            notFound: "Product category not found"
        },
        technician: {
            list: "Technician list retrieved successfully",
            notFound: "Technician not found"
        },
        user: {
            list: "User list retrieved successfully",
            notFound: "User not found"
        },
        product: {
            add: "Product added successfully",
            notFound: "Product not found",
            update: "Product updated successfully",
            list: "Product list retrieved successfully",
            get: "Product retrieved successfully",
            delete: "Product deleted successfully",
        },
        role: {
            role: " Role changed successfully"
        },
        repair_category: {
            added: "Repair category added successfully",
            list: "Repair category list retrieved successfully",
            get: "Repair category retrieved successfully",
            update: "Repair category updated successfully",
            delete: "Repair category deleted successfully",
            notFound: "Repair category not found",
            alreadAxists: "Repair category already axists",
            status: "Repair category status updated successfully",
        },
        invoice: {
            details: "Invoice details retrieved successfully"
        }
    },
    USER: {
        product_category: {
            list: "Categories retrieved successfully"
        },
        order: {
            submit: "Order submitted successfully",
            list: "Order retrieved successfully",
            notFound: "Order not found"
        },
        repair_req: {
            submit: "Repair request submitted successfully",
            list: "Repair request list retrieved successfully",
            notFound: "Repair request not found",
            accept: "Repair request accepted",
            cancle: "Repair request cancelled successfully",
            accept: "Repair request accepted successfully",
            assign: "Repair request assigned to technician successfully",
            mode: "Repair request mode updated successfully",
            invalid: "Invalid repair request mode"
        },
        card: {
            add: "Card added successfully",
            list: "Card list retrieved successfully",
            get: "Card list retrieved successfully",
            notFound: "Card not found",
            update: "Card updated successfully",
            delete: "Card deleted successfully",
            alreadAxists: "Card already exists"
        }
    },
    NOTIFICATION: {
        submit: "Repair request has been submitted by the user",
        accepted: "Your repair request has been accepted by the admin",
        cancle: "Your repair request has been cancelled by the admin",
        assign: "Repair request has been assigned you by the admin",
        complete: "Repair request has been completed by the technician",
        order: "Order has been completed by the user",
        list: "Notification list retrieved successfully",
        get: "Notification retrieved successfully",
        notFound: "Notification not found",
    }
};