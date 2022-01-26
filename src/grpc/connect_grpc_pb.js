// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var connect_pb = require('./connect_pb.js');

function serialize_CommonReply(arg) {
  if (!(arg instanceof connect_pb.CommonReply)) {
    throw new Error('Expected argument of type CommonReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CommonReply(buffer_arg) {
  return connect_pb.CommonReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_CommonRequest(arg) {
  if (!(arg instanceof connect_pb.CommonRequest)) {
    throw new Error('Expected argument of type CommonRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_CommonRequest(buffer_arg) {
  return connect_pb.CommonRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var LiveService = exports.LiveService = {
  sayHello: {
    path: '/Live/SayHello',
    requestStream: false,
    responseStream: false,
    requestType: connect_pb.CommonRequest,
    responseType: connect_pb.CommonReply,
    requestSerialize: serialize_CommonRequest,
    requestDeserialize: deserialize_CommonRequest,
    responseSerialize: serialize_CommonReply,
    responseDeserialize: deserialize_CommonReply,
  },
  sayHelloAgain: {
    path: '/Live/SayHelloAgain',
    requestStream: false,
    responseStream: false,
    requestType: connect_pb.CommonRequest,
    responseType: connect_pb.CommonReply,
    requestSerialize: serialize_CommonRequest,
    requestDeserialize: deserialize_CommonRequest,
    responseSerialize: serialize_CommonReply,
    responseDeserialize: deserialize_CommonReply,
  },
  start: {
    path: '/Live/Start',
    requestStream: false,
    responseStream: false,
    requestType: connect_pb.CommonRequest,
    responseType: connect_pb.CommonReply,
    requestSerialize: serialize_CommonRequest,
    requestDeserialize: deserialize_CommonRequest,
    responseSerialize: serialize_CommonReply,
    responseDeserialize: deserialize_CommonReply,
  },
  stop: {
    path: '/Live/Stop',
    requestStream: false,
    responseStream: false,
    requestType: connect_pb.CommonRequest,
    responseType: connect_pb.CommonReply,
    requestSerialize: serialize_CommonRequest,
    requestDeserialize: deserialize_CommonRequest,
    responseSerialize: serialize_CommonReply,
    responseDeserialize: deserialize_CommonReply,
  },
};

exports.LiveClient = grpc.makeGenericClientConstructor(LiveService);
