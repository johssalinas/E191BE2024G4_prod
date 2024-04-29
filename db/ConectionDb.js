import mongoose from "mongoose";

export const connectMongo = async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://UTS:uts2024@uts.ccyqodk.mongodb.net/Dev2024E191?retryWrites=true&w=majority&appName=UTS/citas"
		);

		console.log("Base de datos conectada correctamente");
	} catch (error) {
		console.log(error);
	}
};
