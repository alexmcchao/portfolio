#!/usr/bin/env python
import pika

credentials = pika.PlainCredentials('username', 'password')
connection =pika.BlockingConnection(pika.ConnectionParameters('IP', 5672, '/', credentials))

channel = connection.channel()

channel.queue_declare(queue='csworks_PO_Queue')

def on_request(ch, method, props, body):
    n = body

    print(" [.] requested message is %s" % n)
    response = "good"

    ch.basic_publish(exchange='',
                     routing_key=props.reply_to,
                     properties=pika.BasicProperties(correlation_id = \
                                                         props.correlation_id),
                     body=str(response))
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='csworks_PO_Queue', on_message_callback=on_request)

print("Awaiting SO requests")
channel.start_consuming()
