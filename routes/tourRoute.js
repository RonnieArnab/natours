const express = require('express');
const router = express.Router();
const tourController = require('./../controller/tourController')
const authController = require('./../controller/authController')
// router.param('id',tourController.checkID);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tours-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router.route('/').get(authController.protect, tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTours).patch(tourController.updateTours).delete(authController.protect, authController.restrictTo('adimin', 'lead-guide'), tourController.deleteTour);

module.exports = router;