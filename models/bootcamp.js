const mongoose = require('mongoose')
const slugify = require('slugify')
const geocoder = require('../utils/geocoder')
const schema = mongoose.Schema

const BootcampSchema = new schema ({
     name: {
        type: String,
        required: [true, "Ajouter un nom , c'est obligatoire"],
        unique: true,
        trim: true,
        maxlength: [50, "le nom ne doit pas depasser 50 caracteres"]
     },
     slug: String,
     description: {
        type: String,
        required: [true, "Ajouter un nom , c'est obligatoire"],
        maxLength: [500, "la description ne doit pas depasser 500 caracteres"]
     },
     website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Ajouter un lien valide avec http ou https'
            ]
     },
     phone: {
        type: String,
        maxlength: [20, 'le numero de telephone ne doit pas depasser 20 chiffres']
     },
     email: {
        type: String,
        match: [
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            'Ajouter un email valide'
        ]
     },
     address: {
        type: String,
        required: [true, 'ajouter une adresse']
     },
     location: {
        type: {
          type: String, 
          enum: ['Point'], 
          
        },
        coordinates: {
          type: [Number],
         
          index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
      },
      careers: {
        // arrays of strings
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
      },
      averageRating: {
        type: Number,
        min: [1, 'La notation ne peut pas etre plus petite que 1'],
        max: [10, 'La notation ne peut pas etre plus grande que 10']
      },
      averageCost: Number,
      photo: {
        type: String,
        default: 'no-photo.jpg'
      },
      housing: {
        type: Boolean,
        default: false
      },
      jobAssistance: {
        type: Boolean,
        default: false
      },
     jobGuatantee: {
        type: Boolean,
        default: false
      },
      accepteGi: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
})

// create bootcamp slug from a name
BootcampSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower: true})
  next()
})

// Geocode and create location field
BootcampSchema.pre('save', async function(next){
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  };

  // Do not save address to DB
  this.address = undefined;
  next();
});




module.exports = mongoose.model('Bootcamp', BootcampSchema )