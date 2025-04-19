"use client"

import Typography from '@mui/material/Typography'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Box from '@mui/material/Box'

interface DeleteModalProps {
    open: boolean
    title: string
    message: string
    onClose: () => void
    onConfirm: () => void
}

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#1e1e1e',
    borderRadius: '16px',
    border: '1px solid #444',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    width: 350,
    p: 2,
    color: '#fff',
}


export const DeleteConfirmModal = ({
    open,
    title,
    message,
    onClose,
    onConfirm
}: DeleteModalProps) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography variant="h6" sx={{ textAlign: "center" }}>
                        {title}
                    </Typography>
                    <Typography sx={{ mt: 1, textAlign: "center" }}>
                        {message}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 2 }}>
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            color="inherit"
                            sx={{
                                borderRadius: '8px',
                                borderColor: '#555',
                                color: '#ccc',
                                '&:hover': {
                                    borderColor: '#777',
                                    backgroundColor: '#2a2a2a',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            variant="contained"
                            color="error"
                            sx={{ borderRadius: '8px' }}
                        >
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal >
    )
}
