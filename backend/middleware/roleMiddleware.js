const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access Denied. You don't have permission."
        });
      }

      next();

    } catch (error) {
      return res.status(500).json({
        message: "Authorization Error"
      });
    }
  };
};

export default roleMiddleware;