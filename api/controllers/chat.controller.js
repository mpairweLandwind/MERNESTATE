import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userRef;

  // Log the received user ID or lack thereof
  console.log("Received user ID:", tokenUserId);

  if (!tokenUserId) {
    console.log("No user ID provided in the request.");
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    console.log(`Retrieving chats for user ID: ${tokenUserId}`);
    const chats = await prisma.chat.findMany({
      where: {
        userRefs: {
          hasSome: [tokenUserId],
        },
      },
    });

    // Log the retrieved chats
    console.log(`Retrieved ${chats.length} chats for user ID: ${tokenUserId}`);

    const enhancedChats = await Promise.all(chats.map(async (chat) => {
      const receiverId = chat.userRefs.find((id) => id !== tokenUserId);

      if (receiverId) {
        console.log(`Fetching details for receiver ID: ${receiverId}`);
        const receiver = await prisma.user.findUnique({
          where: {
            id: receiverId,
          },
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        });
        console.log(`Details fetched for receiver ID: ${receiverId}`, receiver);
        chat.receiver = receiver;
      } else {
        console.log(`No receiver ID found different from sender ID: ${tokenUserId}`);
        chat.receiver = null;
      }

      return chat;
    }));

    // Log the enhanced chats before sending the response
    console.log("Sending back enhanced chats data");
    res.status(200).json(enhancedChats);
  } catch (err) {
    console.error("Error retrieving chats:", err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};


export const getChat = async (req, res) => {
  const tokenUserId = req.userRef;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userRefs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userRef;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userRefs: [tokenUserId, req.body.receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userRef;

  
  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userRefs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
