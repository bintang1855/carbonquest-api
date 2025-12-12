import { createApp } from "./app.js";
const PORT = process.env.PORT || 4000;
const app = createApp();
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}/docs`);
});
//# sourceMappingURL=server.js.map