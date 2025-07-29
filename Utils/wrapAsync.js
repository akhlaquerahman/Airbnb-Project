module.exports = (fn)=>{
    return (req, rew, next)=>{
        fn(req, rew, next).catch(next);
    }
}