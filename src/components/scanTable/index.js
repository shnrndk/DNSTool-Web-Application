import React, { useState, useEffect } from 'react'
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/styles';
import { Chip } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import DownloadKey from '../dashboard/downloadKey';
import { useDispatch, useSelector } from 'react-redux'
import { useFirebase } from 'react-redux-firebase'
import { getScans } from '../../store/actions';

const useStyles = makeStyles({
    root: {
        '& .super-app-theme--header': {
            backgroundColor: 'rgba(255, 7, 0, 0.55)',
        },
    },
});

function ScanTable() {

    const classes = useStyles()
    const firebase = useFirebase()
    const dispatch = useDispatch()

    const scansData = useSelector((state) => state.scanData.scanlist.data)

    const [openKeyDownloadModal, setOpenKeyDownloadModal] = useState(false)

    const handleOpen = () => {
        setOpenKeyDownloadModal(true)
    }
    const handleClose = () => setOpenKeyDownloadModal(false);

    const [scans, setScans] = useState([])

    useEffect(() => {
        getScans(firebase)(dispatch)
    }, [])

    const processScansData = () => {
        let tempKeys = Object.keys(scansData)
        let tempArray = []

        scansData && Object.values(scansData).map((item, i) => {
            tempArray.push({
                ...item,
                key: tempKeys[i],
                id: tempKeys[i]
            })
        })
        setScans(tempArray)
    }

    useEffect(() => {
        setScans(scansData)
        processScansData()
    }, [scansData])

    const columns = [
        { field: 'id', headerName: 'ID', width: 160, sortable: false, headerAlign: 'center', },
        {
            field: 'state',
            headerName: 'State',
            width: 100,
            sortable: false,
            headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <>
                        {
                            params && params.row.state === 'active' ?
                                (<Chip label={params.row.state} style={{ backgroundColor: '#dbf3e5', textTransform: 'capitalize' }} />) :
                                (<Chip label={params.row.state} />)
                        }
                    </>

                )
            }
        },
        { field: 'regions', headerName: 'Scanning Regions', headerAlign: 'center', width: 200, sortable: false },
        { field: 'zones', headerName: 'Zones', width: 200, headerAlign: 'center', sortable: false },
        {
            field: 'key',
            headerName: 'Key',
            width: 130,
            sortable: false,
            headerAlign: 'center',
            renderCell: (params) => {
                return (
                    <GetAppIcon onClick={() => handleOpen(params.row.key)} />
                )
            }
        },
    ];

    return (
        <div style={{ height: 400, width: '100%' }} className={classes.root}>
            <DataGrid rows={scans} columns={columns} pageSize={5} checkboxSelection />
            <DownloadKey open={openKeyDownloadModal} handleClose={handleClose} />
        </div>
    )
}

export default ScanTable
