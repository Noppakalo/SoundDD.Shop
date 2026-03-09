export default defineAppConfig({
    ui: {
        icons: {
            arrowLeft: 'i-iconamoon:arrow-left-2',
            arrowRight: 'i-iconamoon:arrow-right-2',
        },
        button: {
            slots: {
                base: ['cursor-pointer justify-center'],
            },
            variants: {
                size: {
                    md: {
                        base: 'px-4 py-1 text-base gap-2.5',
                    },
                    lg: {
                        base: 'px-6 py-2 text-base gap-2.5',
                    },
                },
            },
            compoundVariants: [
                {
                    color: 'primary',
                    variant: 'solid',
                    class: 'bg-primary hover:bg-primary-700 active:bg-primary-900 disabled:bg-white-600 disabled:text-white-800',
                },
                {
                    color: 'primary',
                    variant: 'outline',
                    class: 'ring ring-inset ring-white text-white hover:bg-primary hover:text-white active:bg-primary active:text-white disabled:bg-white-600 disabled:text-white-800 aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                },
                {
                    color: 'secondary',
                    variant: 'outline',
                    class: 'ring ring-inset ring-primary text-primary hover:bg-primary-50 hover:ring-primary-700 hover:text-black-300 active:bg-primary-100 active:text-primary-900 active:ring-primary-900 disabled:bg-white-600 disabled:text-white-800',
                },
                {
                    color: 'tertiary',
                    variant: 'solid',
                    class: 'bg-white text-primary hover:bg-primary-700 hover:text-white active:bg-primary-900 disabled:bg-white-600 disabled:text-white-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                },
            ],
            defaultVariants: {
                color: 'primary',
                variant: 'solid',
                size: 'lg',
            },
        },
        carousel: {
            slots: {
                root: 'relative focus:outline-none',
                arrows: 'pointer-events-none',
                controls: 'pointer-events-none absolute inset-y-0 inset-x-20',
                prev: 'absolute rounded-full size-10 pointer-events-auto',
                next: 'absolute rounded-full size-10 pointer-events-auto',
                dots: 'bottom-4',
                dot: 'bg-black/50',
            },
            variants: {
                active: {
                    true: {
                        dot: 'data-[state=active]:bg-primary',
                    },
                },
            },
        },
        breadcrumb: {
            slots: {
                list: 'gap-2.5',
                separatorIcon: 'size-4 text-primary',
            },
            variants: {
                active: {
                    true: {
                        link: 'text-black font-medium',
                    },
                    false: {
                        link: 'text-normal text-black-200',
                    },
                },
            },
            compoundVariants: [
                {
                    class: {
                        link: ['hover:text-primary'],
                    },
                },
            ],
        },
        navigationMenu: {
            variants: {
                active: {
                    false: {
                        link: 'text-black',
                        linkLeadingIcon: 'text-black',
                    },
                },
            },
            compoundVariants: [
                {
                    disabled: false,
                    active: false,
                    variant: 'pill',
                    class: {
                        link: ['hover:text-primary hover:before:bg-primary/10'],
                        linkLeadingIcon: ['group-hover:text-primary'],
                    },
                },
                {
                    variant: 'pill',
                    active: true,
                    highlight: false,
                    class: {
                        link: 'before:bg-primary/10',
                    },
                },
            ],
        },
    },
})
