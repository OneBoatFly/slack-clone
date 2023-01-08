from flask import Blueprint
from app.models import db, Channel, Group, ChannelMessage, GroupMessage
from flask_login import login_required, current_user
import json

search_routes = Blueprint('search', __name__)

@search_routes.route('/<string:keyword>')

@login_required
def search_channel_message(keyword):
    all_channels = Channel.query.all()
    all_groups = Group.query.all()

    result_channel =[]
    result_group =[]

    obj_channel = {}
    obj_group ={}

    for channel in all_channels:
        if current_user in channel.channel_members:
            arr_channels = []
            channel_messages = channel.channel_messages
            for message in channel_messages:
                messageObj = json.loads(message.content)
                messageText = messageObj['blocks'][0]['text']
                if keyword.lower() in messageText.lower():
                    arr_channels.append(message.to_dict_basics())
            if (arr_channels):
                obj_channel["channelId"+ " " + str(channel.id)] = arr_channels

    result_channel.append(obj_channel)


    for group in all_groups:
        if current_user in group.group_user_groups:
            arr_groups = []

            group_msg = group.group_messages
            for msg in group_msg:
                if keyword.lower() in msg.content.lower():
                    arr_groups.append(msg.to_dict_basics())
            if (arr_groups):
                obj_group["groupId"+ " " + str(group.id)] = arr_groups
    result_group.append(obj_group)

    return {"Channel_Message":result_channel,"Group_Message":result_group}
