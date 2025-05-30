import {
    RiPencilLine,
    RiDeleteBin6Line,
    RiAddLine,
    RiCheckLine,
    RiCloseLine,
    RiSearchLine,
    RiBuilding2Line,
    RiBuilding4Line,
    RiTeamLine,
    RiHome2Line,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiRefreshLine,
    RiDownload2Line,
    RiUpload2Line,
    RiAlertLine,
    RiInformationLine,
    RiErrorWarningLine,
    RiCheckboxCircleFill
} from 'react-icons/ri';

export const appIcons = {
    edit: RiPencilLine,
    delete: RiDeleteBin6Line,
    add: RiAddLine,
    save: RiCheckLine,
    cancel: RiCloseLine,
    search: RiSearchLine,
    business: RiBuilding2Line,
    city: RiBuilding4Line,
    group: RiTeamLine,
    domain: RiHome2Line,
    building: RiBuilding2Line,
    check: RiCheckboxCircleLine,
    close: RiCloseCircleLine,
    refresh: RiRefreshLine,
    download: RiDownload2Line,
    upload: RiUpload2Line,
    warning: RiAlertLine,
    info: RiInformationLine,
    error: RiErrorWarningLine,
    success: RiCheckboxCircleFill
};

export const appColors = {
    primary: '#E31937', // VML Red
    secondary: '#2B2B2B',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    background: '#F5F5F5',
    paper: '#FFFFFF',
    text: {
        primary: '#2B2B2B',
        secondary: '#757575'
    }
};

export const sweetAlertConfig = {
    confirmButtonColor: appColors.primary,
    cancelButtonColor: appColors.secondary,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
}; 