const express = require("express")
const app = express()
app.use(express.json())

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL
const SECRET     = process.env.ROBLOX_SECRET

app.post("/report", async (req, res) => {
    if (req.headers["x-secret"] !== SECRET) {
        return res.status(403).json({ error: "Forbidden" })
    }

    const { username, userId, category, description, place } = req.body

    const embed = {
        embeds: [{
            title: `🐛 New ${category} Report`,
            color: 0xE74C3C,
            fields: [
                { name: "👤 Player",      value: `${username} (${userId})`, inline: true },
                { name: "📂 Category",    value: category,                  inline: true },
                { name: "🗺️ Place",       value: place,                     inline: true },
                { name: "📝 Description", value: description,               inline: false },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "Roblox Bug Reporter" }
        }]
    }

    try {
        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(embed)
        })
        res.json({ ok: true })
    } catch (e) {
        res.status(500).json({ error: "Failed to send" })
    }
})

app.listen(3000, () => console.log("Running on port 3000"))
