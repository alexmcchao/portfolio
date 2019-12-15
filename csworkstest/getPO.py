#!/usr/bin/env python
import pika
import uuid

class csworksGetPOClient(object):

    def __init__(self):
        credentials = pika.PlainCredentials('username', 'password')
        self.connection = pika.BlockingConnection(pika.ConnectionParameters('IP', 5672, '/', credentials))

        self.channel = self.connection.channel()

        result = self.channel.queue_declare(queue='', exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True)

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, message):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        self.channel.basic_publish(
            exchange='',
            routing_key='csworks_PO_Queue',
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id,
            ),
            body=message)
        while self.response is None:
            self.connection.process_data_events()
        return self.response


myrpc = csworksGetPOClient()

print(" [x] Requesting needPO")
response = myrpc.call('needPO')
print(" [.] Got %r" % response)
