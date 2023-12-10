exports.paginate = (req) => {
    let { pageNo, pageSize } = req.query;

    pageNo = (isNaN(pageNo) || pageNo <1)? 1 : parseInt(pageNo);
    const limit = (isNaN(pageSize) || pageSize <1)? 5 : parseInt(pageSize);
    
    const offset = limit * (pageNo - 1);
    return { offset, limit};
};