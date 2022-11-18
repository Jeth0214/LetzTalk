<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Ratchet\MessageComponentInterface;

use Ratchet\ConnectionInterface;

use App\Models\User;

use App\Models\Chat;

use App\Models\Chat_request;

use Auth;

class SocketController extends Controller implements MessageComponentInterface
{
    //
    protected $clients;

    public function _construct() {
        $this->$clients = new  \SplObjectsStorage;
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->$clients->attach($conn);
    }

    public function onClose(ConnectionInterface $conn) {
        $this->$clients->detach($conn);
    }
    
    public function onMessage(ConnectionInterface $conn, $message) {
        
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        $conn->close();
        return response('An Error Occured: ' . $e->getMessage() );
    }
}
