self.addEventListener(
  "install",
  () => {
    self.skipWaiting();
  }
);

self.addEventListener(
  "activate",
  event => {
    event.waitUntil(
      self.clients.claim()
    );
  }
);

self.addEventListener(
  "push",
  event => {
    let data = {};

    try {
      data =
        event.data
          ? event.data.json()
          : {};
    } catch {
      data = {
        body:
          event.data?.text() ??
          ""
      };
    }

    const title =
      data.title ??
      "Vekt";

    const options = {
      body:
        data.body ??
        "Tid for dagens innveiing 🌿",

      data: {
        url:
          data.url ??
          self.registration.scope
      }
    };

    event.waitUntil(
      self.registration
        .showNotification(
          title,
          options
        )
    );
  }
);

self.addEventListener(
  "notificationclick",
  event => {
    event.notification.close();

    const targetUrl =
      event.notification.data?.url ??
      self.registration.scope;

    event.waitUntil(
      clients
        .matchAll({
          type:
            "window",

          includeUncontrolled:
            true
        })
        .then(
          async openClients => {
            for (
              const client
              of openClients
            ) {
              if (
                "focus" in client
              ) {
                try {
                  await client.navigate(
                    targetUrl
                  );
                } catch {
                  // Kan fortsatt fokusere vinduet.
                }

                return client.focus();
              }
            }

            if (
              clients.openWindow
            ) {
              return clients.openWindow(
                targetUrl
              );
            }
          }
        )
    );
  }
);
