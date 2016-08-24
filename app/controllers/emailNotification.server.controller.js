var AWS = require('aws-sdk'); 
var ses = new AWS.SES({
      apiVersion: '2010-12-01', 
      // endpoint: 'email-smtp.eu-west-1.amazonaws.com',
      accessKeyId: 'AKIAIH5MUYBBLMCX4MEQ',
      secretAccessKey: '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',
      region : 'eu-west-1'
       });
var emialTemplatePre  = '<table style="width:600px"><tbody><tr style="background-color:rgb(9, 124, 241); height: 100px;"><td style="font-size:30px; color:white;"><center>Yajidu</center></td></tr><tr><td><br><br>';
var emialTemplatePost ='</td></tr></tbody></table>'

exports.sendEmail = function(mailOptions){

// this must relate to a verified SES account
var from = 'wasif.jahangir@gmail.com'

// this sends the email
// @todo - add HTML version
ses.sendEmail( { 
   Source: from, 
   Destination: { ToAddresses: [mailOptions.to] },
   Message: {
       Subject : {
          Data: mailOptions.subject
       },
       Body: {
           Html: {
               Data: emialTemplatePre + mailOptions.html + emialTemplatePost,
           }
        }
   }
}, function(err, data) {
    if(err){
      console.log(err);
    }
        console.log('Email sent:');
        console.log(data);
    });
};
