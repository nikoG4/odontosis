import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const buttonVariants: (props?: {
    variant?: "default" | "secondary" | "outline" | "ghost";
    size?: "default" | "sm" | "lg";
} & import("class-variance-authority/dist/types").ClassProp) => string;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
}
export declare function Button({ className, variant, size, ...props }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
