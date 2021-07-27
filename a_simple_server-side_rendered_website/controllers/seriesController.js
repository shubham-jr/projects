// -----------------------------------requiring-files-------------------------------------------

const series_model=require('./../models/models.js');

const apiFeatures=require('./../utils/apiFeatures.js');

// ---------------------------aliasing_api_middleware------------------------------------------

exports.api_aliasing_middleware=(req,res,next)=>{
    req.query.limit=3;
    req.query.sort='-rating,-year';
    req.query.fields='moviename,actors,review,rating,year';
	next();
}

// ---------------------------get-request-from-mongo-db-and-some-api-features-------------------
exports.getdata=async (req,res)=>{

try{
const feature_obj=new apiFeatures(series_model.find(),req.query)
.filter()
.sort()
.fields()
.paginate();

const getdataobj=await feature_obj.query;

res.status(200).json({
	status:'success',
	total_results:getdataobj.length,
	data:{
		getdataobj
	}
}); 

// -------------------------------------catching error------------------------------------------
}catch(err){
	res.status(404).json({
    status:'failed sir',
    message:err
	});
}
}
// -----------------------get-request-end------------------------------------------

// --------------------post-request-start------------------------------------------


exports.postdata=async (req,res)=>{
try{
const postdataobj=await series_model.create(req.body);
res.status(201).json({
	status:'success',
	data:{
		postdataobj
	}
});	
}catch(err){
	res.status(404).json({
    status:'failed',
    message:err
	});
}
}
// -----------------------post-request-end-----------------------------------------

// ----------------------get-an-unique-data----------------------------------------
exports.get_a_data=async(req,res)=>{
	try{
		const get_a_data=await series_model.findById(req.params.id);
	res.status(200).json({
		status:'success',
		data:{
           get_a_data
		}
	});
	}catch(err)
	{
		res.status(404).json({
         status:'failed',
         message:err
		});
	}
}

// --------------------get-a-unique-data-end--------------------------------------------

// ----------------------------update-a-data-----------------------------------------
exports.update_a_data=async(req,res)=>{
    try{
		const update_a_data=await series_model.findByIdAndUpdate(req.params.id,req.body,{
			new:true,
			runValidators:true
		});
	res.status(200).json({
		status:'success',
		data:{
           update_a_data
		}
	});
	}catch(err)
	{
		res.status(404).json({
         status:'failed',
         message:err
		});
	}
}
// ----------------------------update-a-data-end--------------------------------------

// -------------------------------delete-a-data----------------------------------------
exports.delete_a_data=async(req,res)=>{
	try{
		await series_model.findByIdAndDelete(req.params.id);
	res.status(200).json({
		status:'success',
		data:null
	});
	}catch(err)
	{
		res.status(404).json({
         status:'failed',
         message:err
		});
	}
}
// --------------------------------delete-a-data-end-----------------------------------------

exports.top_three_web_series=async(req,res)=>{
	try{
		let query=series_model.find();
	const page=req.query.page*1 ||1;
	const limit=req.query.limit*1 ||1;
	const skip=(page-1)*limit;
	query=query.sort(req.query.sort.split(',').join(' ')).select(req.query.fields.split(',').join(' ')).limit(limit).skip(skip);
	const getdata=await query;
	res.status(200).json({
		status:'success',
		total_results:getdata.length,
		data:{
			getdata
		}
	})
}catch(err)
{
  res.status(404).json({
  	status:'failed',
  	message:err
  });	
}
}

