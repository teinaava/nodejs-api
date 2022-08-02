export function getOffestAndTotalPages(page,limit,total){
    let totalPages = Math.ceil(total / limit);
    let offest = ( (page - 1) * limit);
    return {
        offest: offest,
        totalPages: totalPages
    }
}


