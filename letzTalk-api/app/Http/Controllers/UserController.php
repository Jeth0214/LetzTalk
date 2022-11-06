<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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
}
