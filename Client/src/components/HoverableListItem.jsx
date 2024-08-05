import  { useState } from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemPrefix } from "@material-tailwind/react";

const HoverableListItem = ({ children, icon, style: userStyle }) => {
    const [hover, setHover] = useState(false);

    const style = {
        marginRight: '15px',
        backgroundColor: hover ? 'lightgray' : 'transparent',
        transition: 'background-color 0.3s ease',
        cursor: 'pointer',
        ...userStyle,
    };

    return (
        <ListItem
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={style}
        >
            <ListItemPrefix style={{ marginRight: '15px' }}>
                {icon}
            </ListItemPrefix>
            {children}
        </ListItem>
    );
};

HoverableListItem.propTypes = {
    children: PropTypes.node.isRequired,
    icon: PropTypes.element.isRequired,
    style: PropTypes.object,
};

export default HoverableListItem;
