import { Link } from 'react-router-dom';
import { Card, Typography, List } from "@material-tailwind/react";
import HoverableListItem from './HoverableListItem'; // Assuming separate file import
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import './siderbar.scss';

export default function Sidebar() {
    return (
        <Card className="h-[calc(100vh-2rem)] w-full max-w-[16rem] p-2 shadow-xl shadow-blue-gray-900/5  siderbar ">
            <div className="mb-2 p-2 mt-12">
                <Typography variant="h3" color="orange">
                    DashBoard
                </Typography>
            </div>
            <List>
                <Link to='/landlord/dashboard' aria-label="Dashboard">
                    <HoverableListItem icon={<PresentationChartBarIcon className="h-5 w-5" />}>
                        Dashboard
                    </HoverableListItem>
                </Link>
                <Link to='/landlord/create-listing' aria-label="E-Commerce">
                    <HoverableListItem icon={<ShoppingBagIcon className="h-5 w-5" />}>
                        Add Property  (Rent&sale)
                    </HoverableListItem>
                </Link>
                <Link to='/landlord/createMaintenance' aria-label="Inbox">
                    <HoverableListItem icon={<InboxIcon className="h-5 w-5" />}>
                      Register For Maintenance
                    </HoverableListItem>
                </Link>
                <Link to='/landlord/profile' aria-label="Profile">
                    <HoverableListItem icon={<UserCircleIcon className="h-5 w-5" />}>
                        Profile
                    </HoverableListItem>
                </Link>
                <Link to='/landlord/dashboard' aria-label="Settings">
                    <HoverableListItem icon={<Cog6ToothIcon className="h-5 w-5" />}>
                        Settings
                    </HoverableListItem>
                </Link>
                <Link to='/logout' aria-label="Log Out">
                    <HoverableListItem icon={<PowerIcon className="h-5 w-5" />}>
                        Log Out
                    </HoverableListItem>
                </Link>
            </List>
        </Card>
    );
}
