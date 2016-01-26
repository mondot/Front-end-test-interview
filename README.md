# my-picture-uploader
Form that allow the user to enter basic profile information and upload a picture. 

 - The backend (provided in server folder) validate that all the required params are sent and then (using an API such as http://apicloud.me/apis/facerect/demo/) that the photo contains a face,
 - If it is valid, a success message is displayed, otherwise it display an error message.
 - the form should look like resources/form.png 
 - the font used is [Railway](https://www.google.com/fonts/specimen/Raleway) and the images are available in the client/images folder

## Exercise
Implement the client side of the application which will use the server. Add your code in the client folder. 

Feel free to add anything you wish: 

 - client side validation
 - responsive design
 - tests
 - task runner
 - ...
 
Note that **none of them are mandatory** it is just if you want to show some particular skills.

## Run
    npm install
    npm start

## Backend API

`GET /*` render index.html

`POST /api/user` create a user

Parameters | Type | Required
--- | --- | ---
 firstName | string | YES
 lastName | string | YES 
 email | string  | YES
 
 Returns
 
 - 400 if one parameters is missing
 - 200 otherwise
 
`POST /api/user/picture` upload multi part the file and check the face

Calls with the following params

 - headers: {'Content-Type': undefined}
 - transformRequest: function (data) { return new FormData().append('file', data.file); }
 - data: {file: file}

Returns

 - 406 if the picture doesn't contain faces
 - 201 if the picture contains faces
