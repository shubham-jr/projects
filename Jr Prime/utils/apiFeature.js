class apiFeature
{
   constructor(queryObject,query)
   {
        this.queryObject = queryObject;
        this.query = query;
   } 

   filter()
   {
        const excludedFields = ['page','limit','sort','fields'];   
        const queryObj = {...this.queryObject};  
        excludedFields.forEach(el=>delete queryObj[el]); 
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g,match=>`$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
   }

   sort()
   {
        if(this.queryObject.sort)
        this.query = this.query.sort(this.queryObject.sort.split(',').join(' '));
        return this;
   }

   fields()
   {
        if(this.queryObject.fields)
        this.query = this.query.select(this.queryObject.fields.split(',').join(' '));
        return this;
   }

   limits()
   {
        const page = this.queryObject.page*1||1;
        const limit = this.queryObject.limit*1||5;
        const skip = (page-1)*limit;
        if(this.queryObject.page)
        this.query = this.query.skip(skip).limit(limit);
        return this;
   }
}
module.exports = apiFeature;