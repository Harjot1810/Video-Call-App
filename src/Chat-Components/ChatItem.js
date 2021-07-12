import React from "react";
import { ListItem } from "@material-ui/core";

class ChatItem extends React.Component {
    render() {
        const { message, identity } = this.props;
        const isOwnMessage = message.author === identity;               //check if message is sent by local participant or not

        return (
            <ListItem style={styles.listItem(isOwnMessage)}>
                <div style={styles.author}>{message.author}</div>
                <div style={styles.container(isOwnMessage)}>
                    {message.body}
                    <div style={styles.timestamp}>
                        {new Date(message.dateCreated.toISOString()).toLocaleString()}
                    </div>
                </div>
            </ListItem>
        );
    }
}

const styles = {
    listItem: (isOwnMessage) => ({
        flexDirection: "column",
        alignItems: isOwnMessage ? "flex-end" : "flex-start",
    }),
    container: (isOwnMessage) => ({
        maxWidth: "75%",
        borderRadius: 5,
        padding: 16,
        color: "black",
        fontSize: 14,
        backgroundColor: isOwnMessage ? "#66CDAA" : "#BDC3C7",
    }),
    author: { fontSize: 12, color: "black" },
    timestamp: { fontSize: 8, color: "black", textAlign: "right", paddingTop: 4 },
};

export default ChatItem;