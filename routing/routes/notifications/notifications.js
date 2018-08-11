module.exports.path = "notify";
module.exports.method = "get";

module.exports.called = function (req, res) {
	let formatter = require(`${__basedir}/utils/response-formatter`);

	const date = new Date(req.param("date"));
	if (!date) {
		console.log("Invalid date requested: " + req.param("date") + ".");

		res.json(formatter.error("Invalid date requested"));
		return;
	}

	const endDate = new Date(date).setDate(date.getDate() + 14);

    require(`${__basedir}/database/models/schedule`).find({
		date: { 
            $gte: date, 
            $lte: endDate 
        },
        changed: true // Only fetch Schedules that have the Changed flag for a changed schedule.
	}, function (error, object) {
        if (error) {
            console.log("Failed to fetch upcoming changed days.");
            
            res.json(formatter.error("Failed to fetch upcoming changed days."));
            return;
        }
        
        const dateFormatter = require(`${__basedir}/utils/date-formatter`);
        let resultList = [];
        
		object.forEach(function(item) {
			resultList.push(dateFormatter(item["date"]));
		});
        
        res.json(formatter.success(resultList, "notification dates", dateFormatter(date)));
    });
};