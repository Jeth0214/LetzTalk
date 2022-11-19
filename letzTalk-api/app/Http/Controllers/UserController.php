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
        };
        $token = $user->createToken('letstalk-token')->plainTextToken;
        $user->token = $token;
        $user->save();

        $response = [
            'status' => 'success',
            'user' => $user,
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
        $profilePic = $request->user_image;
        if($request->user_image != '') {
            $extension = $profilePic->extension();
            $profilePicName = $request->email . '-' . time() . '.' .$extension;
            $profilePic->storeAs('images', time(). "." . $profilePicName);
            $profilePic->move(public_path('images'), $profilePicName);
            // update new profile image
            $user->user_image = $profilePicName;
        };

        //update user data
        $user->name = $request->name;
        $user->email = $request->email;
       

        if($request->password != "" ) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        $data = [
            'status' => 'success',
            'message' => 'You had successfully updated your profile',
            'user' => $user
        ];

        return response($data, 201);
    }

    public function logout() {
        Auth::logout();
        return response(['status' => 'Success'], 200);
    }
}
