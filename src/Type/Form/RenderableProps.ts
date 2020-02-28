import React from 'react';

export interface RenderableProps<T> {
    children?: ((props: T) => React.ReactNode) | React.ReactNode;
    component?: React.ComponentType<T> | string;
    render?: (props: T) => React.ReactNode;
}

export default RenderableProps;
