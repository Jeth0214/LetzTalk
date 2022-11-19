<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Ratchet\MessageComponentInterface;

use Ratchet\ConnectionInterface;

use SplObjectStorage;

use App\Models\User;

use App\Models\Chat;

use App\Models\Chat_request;

use Auth;

class SocketController extends Controller implements MessageComponentInterface
{
    //
    protected $clients;

    public function __construct() {
         $this->clients = new SplObjectStorage();
    }

    public function onOpen(ConnectionInterface $conn) {
        $queryString = $conn->httpRequest->getUri()->getQuery();
        // $user = User::where('email', 'test@example.com')->first();
        //     $user->connection_id = $conn->resourceId;
        //     $user->save(); 
        
        
        // $queryString = $conn->httpRequest()->getUri()->getQuery();
        
        $queryArray = explode('=', $queryString);
        $token = $queryArray[1];
        
        if($token != '') {
                $user = User::where('email', 'test@example.com')->first();
                $user->user_image = $queryString;
                $user->save();  
            }
            $this->$clients->attach($conn);
        }

    public function onClose(ConnectionInterface $conn) {
        $this->$clients->detach($conn);
        // $queryString = $conn->httpRequest()->getUri()->getQuery();
        // parse_str($queryString, $queryArray);
        //  $user = User::where('token', '8|CeR3Zy15pscIAl3aRXSDLCqAy5AAjzISUgRMwDdI')->first();
        // $user->connection_id = 0;
        // $user->save();
    }
    
    public function onMessage(ConnectionInterface $conn, $message) {
        
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        $conn->close();
        return response('An Error Occured: ' . $e->getMessage() );
    }
}
