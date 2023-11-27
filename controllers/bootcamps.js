const ErrorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder.js')
const Bootcamp = require('../models/bootcamp.js')

// @desc      Get all bootcamps
// @route     GET api/v1/bootcamps
// @access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    try {
        // Copy req.query to avoid modifying the original object
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort'];

        // Remove fields from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, $lt, $lte, $in)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Parse the query string into a JSON object
        const parsedQuery = JSON.parse(queryStr);

        // Finding resource
        let query = Bootcamp.find(parsedQuery);

        // Select fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        //Sort
        // Select fields
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else{
            query = query.sort('-createAd');
        }

        // Execute the query
        const bootcamps = await query;

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    } catch (err) {
        next(err); // Pass the error to the global error handler
    }
});


// @desc      Get single bootcamps
// @route     GET api/v1/bootcamps:id
// @access    Public
exports.getBootcamp = asyncHandler( async (req, res, next) => {
   
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            return  next(new ErrorResponse(`Le bootcamp n'as pas ete trouver avec l'Id ${req.params.id}`, 404))
        }

        res.status(200).json({succes: true, data: bootcamp})
   
})


// @desc      Add bootcamps
// @route     POST api/v1/bootcamps
// @access    Private
exports.createBootcamps = asyncHandler( async (req, res, next) => {
    
   
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json(
            {
            succes : true, 
            data : bootcamp
        })
})

// @desc      Update bootcamps
// @route     PUT api/v1/bootcamps:id
// @access    Private
exports.updateBootcamps = asyncHandler( async (req, res, next) => {

   
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body ,{
            new: true,
            runValidators: true
        })
    
        if(!bootcamp){
            return  next(new ErrorResponse(`Lebootcamp n'as pas ete trouver avec l'Id ${req.params.id}`, 404))
        }
        
})

// @desc      Delete bootcamps
// @route     DELETE api/v1/bootcamps:id
// @access    Private
exports.deleteBootcamps = asyncHandler( async (req, res, next) => {
  
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    
        if(!bootcamp){
            return  next(new ErrorResponse(`Lebootcamp n'as pas ete trouver avec l'Id ${req.params.id}`, 404))
        }
        res.status(200).json({succes: true, data: {} })
})



// @desc     Get bootcamps
// @route     DELETE api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler( async (req, res, next) => {
const {zipcode, distance} = req.params
  
// get lat/lng from goecoder
const loc = await geocoder.geocode(zipcode)
const lat = loc[0].latitude
const lng = loc[0].longitude

//calcul radius using radians
//divide dist by radius of Earth
// Earth radius = 3.963 mi / 6.378km
const radius = distance / 3963

const bootcamps = await Bootcamp.find({
    location: {
        $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] }
     } 
    
})

res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
})
})