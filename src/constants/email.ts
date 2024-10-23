interface EmailFormat {
    subject: string;
    body: string;
}

export const EMAIL_FORMAT: { [key: string]: EmailFormat } = {
    DEVICE_ALLOCATED: {
        subject: 'Device Allocated',
        body: 'You have been allocated a device. Please collect it from the admin.'
    },
    DEVICE_RETURNED: {
        subject: 'Device Returned',
        body: 'You have returned the device. Thank you!'
    },
    DEVICE_NOT_RETURNED: {
        subject: 'Device Not Returned',
        body: 'It has been 5 days since the device was due for return. Please return it at the earliest.'
    }
}