<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    //
    function login(Request $request) {
        $user = User::where( 'email', $request->email)->first();
        if(!$user || !Hash::check($request->password, $user->password)) {
            return response([
                'status' => 'danger',
                'message' => 'These credentials do not match our records.'
            ], 404);
        }

        $token = $user->createToken('letstalk-token')->plainTextToken;

        $response = [
            'status' => 'success',
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }


    function register(Request $request) {
        $validateRequest = Validator::make( $request->all(), 
        [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6'
        ]);

        if($validateRequest->fails()) {
            $data = [
                'status' => 'danger',
                'message' => $validateRequest->errors()
            ]; 
            return response( $data , 401);
        }

        $data = $request->all();


        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'])
        ]);

        return response(['status' => 'success', 'message' => 'Successfully registered. You can login now.'], 201);

    }

    public function updateProfile( Request $request, $id) {
        $user = User::findOrFail($id);
        if(Auth::id() != $user->id) {
            return response('Unathorized', 401);
        };
       // Validate request data
        $validateRequest = Validator::make($request->all(), 
        [
            'name' => 'required',
            'email' => 'required|email',
            'user_image' => 'image|mimes:jpg,png,jpeg
                            |max:2048
                            |dimensions:min_width=100,min_height=100,max_width=1000, max_height=1000'
        ]
        );
        // if validation has error , return error message
        if($validateRequest->fails()) {
            $errorData = [
                'status' => 'danger',
                'message' => $validateRequest->errors()
            ];
            return response($errorData, 400);
        };

        // check image request,  store it in storage and get storage path as url
        $profilePicUrl = "";
        $base_images_url = "/public/profile/images";
        if($request->hasFile('user_image')) {
            $extension = $request->user_image->extension();
            $request->user_image->storeAs($base_images_url, $user->name. "-" . time(). "." . $extension);
           $imageUrl = Storage::url($base_images_url, $user->name. "-" . time(). "." . $extension);

           $profilePicUrl = $imageUrl;
        };

        //update user data

        $user->name = $request->name;
        $user->email = $request->email;
        $user->user_image = $profilePicUrl;
        if($request->password != "" ) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response($user, 201);
    }
}
