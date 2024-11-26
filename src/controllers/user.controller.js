import {asyncHandler} from '../utils/asyncHandler.js';

const handleRegisterUser = asyncHandler (async (req, res) => {
    res.status(200).json({msg: 'ok'});
});

export {
    handleRegisterUser
}