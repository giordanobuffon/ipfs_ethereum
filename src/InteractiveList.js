import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import ShareIcon from '@material-ui/icons/Share';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const styles = theme => ({
    root: {
        flexGrow: 1,
        // maxWidth: 752,
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
    },
});

class InteractiveList extends React.Component {
    state = {
        dense: false,
        secondary: false,
    };

    render() {
        const {classes} = this.props;
        const {dense, secondary} = this.state;

        return (
            <div className={classes.root}>
                <Grid container spacing={16}>
                    <Grid item xs={12} md={6}>
                        <div className={classes.demo}>
                            <List dense={dense}>
                                {this.props.files.length > 0 ?
                                    this.props.files.map((file) => {
                                            return <div key={file.id}>
                                                <ListItem button={true}>
                                                    <ListItemText
                                                        primary={file.name}
                                                        secondary={secondary ? 'Secondary text' : null}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <IconButton
                                                            aria-label="Share"
                                                            onClick={() => {
                                                                console.log('click share')
                                                            }}>
                                                            <ShareIcon/>
                                                        </IconButton>
                                                        <IconButton
                                                            aria-label="Download"
                                                            onClick={() => {
                                                                this.props.downloadFile(file.hash);
                                                            }}>
                                                            <CloudDownloadIcon/>
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </div>
                                        }
                                    ) : ""}
                            </List>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

InteractiveList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InteractiveList);
