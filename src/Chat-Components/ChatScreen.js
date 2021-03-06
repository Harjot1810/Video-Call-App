import React from "react";
import {
    Container,
    Grid,
    IconButton,
    List,
    TextField,
} from "@material-ui/core";
import '../Initial/App.css'
import { Send } from "@material-ui/icons";
import ChatItem from "./ChatItem";

class ChatScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: "",
            messages: [],
            loading: false,
            channel: null,
        };

        this.scrollDiv = React.createRef();                     //Used in scrollToBottom To keep the screen scrolled at bottom
    }


    connectChannel = async (channel) => {                       //Connecting to the chat channel
        if (channel.channelState.status !== "joined") {
            await channel.join();
        }

        this.setState({
            channel: channel,
            loading: false
        });

        const messages = await channel.getMessages()
        this.setState({ messages: messages.items || [] });
        this.scrollToBottom();

        channel.on("messageAdded", this.messageUpdate);
        this.scrollToBottom();
    };


    messageUpdate = (message) => {                               //invoked after every message update
        const { messages } = this.state;
        this.setState({
            messages: [...messages, message],
        },
            this.scrollToBottom
        );
    };

    scrollToBottom = () => {
        if (this.scrollDiv.current) {
            const scrollHeight = this.scrollDiv.current.scrollHeight;
            const height = this.scrollDiv.current.clientHeight;
            const maxScrollTop = scrollHeight - height;
            this.scrollDiv.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        }
    };

    async updateChannel() {                                     //Updating channel after user changes the channel
        this.setState({
            loading: true
        });

        this.state.channel?.removeAllListeners()

        const room = this.props.room
        const client = this.props.client

        try {
            const channel = await client.getChannelByUniqueName(room);
            this.connectChannel(channel);
        } catch (err) {
            try {
                const channel = await client.createChannel({
                    uniqueName: room,
                    friendlyName: room,
                });

                this.connectChannel(channel);
            } catch {
                console.log(err)
                throw new Error("Unable to create channel, please reload this page");
            }
        }
    }

    componentDidMount = () => {
        this.updateChannel()
    }

    componentDidUpdate(prevProps) {
        if (this.props.room !== prevProps.room) {
            this.updateChannel();
        }
    }

    sendMessage = () => {
        const { text, channel } = this.state;
        if (text) {
            this.setState({ loading: true });
            channel.sendMessage(String(text).trim());
            this.setState({ text: "", loading: false });
        }
    };

    render() {
        const { text, messages, channel } = this.state;
        const { identity } = this.props;

        return (
            <Container component="main" maxWidth="md">

                <Grid container direction="column" style={styles.mainGrid} >
                    <Grid item style={styles.gridItemChatList} ref={this.scrollDiv} tabIndex="0">
                        <List dense={true}>
                            {messages &&
                                messages.map((message) =>
                                    <ChatItem
                                        key={message.index}
                                        message={message}
                                        identity={identity} />
                                )}
                        </List>
                    </Grid>

                    <Grid item style={styles.gridItemMessage}>
                        <Grid
                            container
                            direction="row"
                            justify="center"
                            alignItems="center">
                            <Grid item style={styles.textFieldContainer}>
                                <TextField
                                    required
                                    id="filled-basic"
                                    style={styles.textField}
                                    placeholder="Enter message"
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                    value={text}
                                    disabled={!channel}
                                    onChange={(event) =>
                                        this.setState({ text: event.target.value })
                                    } />
                            </Grid>

                            <Grid item>
                                <IconButton
                                    aria-label="send"
                                    style={styles.sendButton}
                                    onClick={this.sendMessage}
                                    disabled={!channel}>
                                    <Send style={styles.sendIcon} />
                                </IconButton>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        );
    }

}

const styles = {
    button: { backgroundColor: "#262d31", borderWidth: 3 },
    toolbarButtons: { marginLeft: 'auto', },
    textField: { width: "100%", borderWidth: 60, background: "#ECF0F1" },
    textFieldContainer: { flex: 1, marginRight: 12 },
    gridItem: { paddingTop: 12, paddingBottom: 12 },
    gridItemChatList: { overflow: "auto", height: "70vh" },
    gridItemMessage: { marginTop: 12, marginBottom: 12 },
    sendButton: { backgroundColor: "#008080" },
    sendIcon: { color: "white" },
    mainGrid: { paddingTop: 100, borderWidth: 1 },
};

export default ChatScreen;