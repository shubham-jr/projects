class APIFeature
{
  constructor(query,queryObj)
  {
    this.query=query;
    this.queryObj=queryObj;
  }
   
   filter()
   {
    const reqObj={...this.queryObj};
    const excludingTerms=['page','sort','limit','fields'];
    excludingTerms.forEach(el=>delete reqObj[el]);  
    let queryStr=JSON.stringify(reqObj);
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`);
    this.query=this.query.find(JSON.parse(queryStr));
    return this;
   }

   sort()
   {
    if(this.queryObj.sort)
    this.query=this.query.sort(this.queryObj.sort.split(',').join(' '));
    return this;  
   }

   fields()
   {
    if(this.queryObj.fields)
   {
   this.query=this.query.select(this.queryObj.fields.split(',').join(' '));
   }
    else
   {
   this.query=this.query.select('-__v'); 
   }
   return this;
   }

   paginate()
   {
    const page=this.queryObj.page*1||1;
    const limit=this.queryObj.limit*1||1;
    const skip=(page-1)*limit;
    if(this.queryObj.page)
    this.query=this.query.limit(limit).skip(skip);
    return this;  
   }

}

module.exports=APIFeature;