import { Redirect, Route } from "react-router-dom";

export const AdminRoute = ({ component: Component, userAuth, ...rest }) => {
    const check = true;
    return (
        <Route
            {...rest}
            render={(props) =>
                check ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                        }}
                    />
                )
            }
        />
    );
};
