const pseudos = ['mart1pecheur', 'Nal18', 'Clandesmorts', 'P3diluve', 'MattisWENDELS', 'M_carlsen_tryhard', 'Foxesoeboss', 'titis38', 'Emeric10', 'Ambre_07', 'Fraiseaulait'];
  const conteneur = document.getElementById('profil');

  async function rechercher() {
    const joueurs = [];

    for (const pseudo of pseudos) {
      try {
        const [profilRes, statsRes] = await Promise.all([
          fetch(`https://api.chess.com/pub/player/${pseudo}`),
          fetch(`https://api.chess.com/pub/player/${pseudo}/stats`)
        ]);

        const profil = await profilRes.json();
        const stats = await statsRes.json();

        const blitz = stats.chess_blitz?.last?.rating || 'Non classé';
        const bullet = stats.chess_bullet?.last?.rating || 'Non classé';
        const rapid = stats.chess_rapid?.last?.rating || 'Non classé';

        function getGamesCount(record) {
            return (record?.win || 0) + (record?.loss || 0) + (record?.draw || 0);
          }

          const blitzGames = getGamesCount(stats.chess_blitz?.record);
          const bulletGames = getGamesCount(stats.chess_bullet?.record);
          const rapidGames = getGamesCount(stats.chess_rapid?.record);
          

        const totalGames = blitzGames + bulletGames + rapidGames;
        const totalScore = totalGames > 0
          ? (
            (blitz !== 'Non classé' ? blitz * blitzGames : 0) +
            (bullet !== 'Non classé' ? bullet * bulletGames : 0) +
            (rapid !== 'Non classé' ? rapid * rapidGames : 0)
          ) / totalGames
          : 0;

        joueurs.push({
          username: profil.username,
          avatar: profil.avatar || 'https://www.chess.com/bundles/web/images/user-image.007dad08.svg',
          country: profil.country?.split('/').pop() || 'Inconnu',
          status: profil.status || 'Inconnu',
          blitz, bullet, rapid,
          totalGames, totalScore
        });
      } catch (error) {
        console.error(`Erreur pour ${pseudo} :`, error);
        conteneur.innerHTML += `<p>Impossible de récupérer les données pour ${pseudo}.</p>`;
      }
    }

    joueurs.sort((a, b) => b.totalScore - a.totalScore);

    joueurs.forEach(joueur => {
      const carte = `
        <section class="section">
          <div class="container">
            <div class="card">
              <div class="card-content">
                <div class="columns is-vcentered">
                  <div class="column is-narrow">
                    <img src="${joueur.avatar}" alt="Avatar" width="100">
                  </div>
                  <div class="column">
                    <h2 class="title is-4">${joueur.username}</h2>
                    <p><strong>Pays :</strong> ${joueur.country}</p>
                    <p><strong>Status :</strong> ${joueur.status}</p>
                    <p><strong>Score total :</strong> ${joueur.totalScore.toFixed(2)}</p>
                    <p><strong>Parties jouées :</strong> ${joueur.totalGames}</p>
                  </div>
                  <div class="column">
                    <p><strong>Rapide :</strong> ${joueur.rapid}</p>
                    <p><strong>Blitz :</strong> ${joueur.blitz}</p>
                    <p><strong>Bullet :</strong> ${joueur.bullet}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
      conteneur.innerHTML += carte;
    });
  }

  rechercher();