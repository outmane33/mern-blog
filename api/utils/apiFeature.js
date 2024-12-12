class apiFeature {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  //pagination
  pagination(documentCount) {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;
    //padination result
    let paginationResult = {};

    //next page
    if (documentCount > limit) {
      paginationResult.next = page + 1;
    }
    // previous page
    if (page > 1) {
      paginationResult.previous = page - 1;
    }

    this.paginationResult = paginationResult;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }
  //filtering
  filtering() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields", "keyword"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  //sorting
  sorting() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(",").join(" ");
      sortBy = sortBy.replace("asc", "-createdAt");
      sortBy = sortBy.replace("desc", "createdAt");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  //fields
  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  //search
  search() {
    if (this.queryString.keyword) {
      let query = {};
      query.$or = [
        { title: { $regex: this.queryString.keyword, $options: "i" } },
        { content: { $regex: this.queryString.keyword, $options: "i" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }
}

module.exports = apiFeature;
