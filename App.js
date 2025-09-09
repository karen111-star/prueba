import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const ROMBO_SIZE = 40;
const NUBE_SIZE = 50;
const STEP = 20;
const NUBE_SPEED = 10;

export default function App() {
  const [romboX, setRomboX] = useState(width / 2 - ROMBO_SIZE / 2);
  const [nubes, setNubes] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const nubeInterval = useRef(null);
  const gameLoop = useRef(null);

  useEffect(() => {
    if (!gameOver) {
      // ⬇️ ahora las nubes aparecen cada 700 ms
      nubeInterval.current = setInterval(() => {
        const randomX = Math.random() * (width - NUBE_SIZE);
        setNubes((prev) => [...prev, { x: randomX, y: -NUBE_SIZE }]);
      }, 700);

      gameLoop.current = setInterval(() => {
        setNubes((prev) =>
          prev.map((nube) => ({ ...nube, y: nube.y + NUBE_SPEED })).filter((nube) => nube.y < height)
        );
      }, 30);
    }

    return () => {
      clearInterval(nubeInterval.current);
      clearInterval(gameLoop.current);
    };
  }, [gameOver]);

  useEffect(() => {
    nubes.forEach((nube) => {
      if (
        romboX < nube.x + NUBE_SIZE &&
        romboX + ROMBO_SIZE > nube.x &&
        height - 150 < nube.y + NUBE_SIZE &&
        height - 150 + ROMBO_SIZE > nube.y
      ) {
        setGameOver(true);
      }
    });
  }, [nubes, romboX]);

  const moveLeft = () => setRomboX((prev) => Math.max(prev - STEP, 0));
  const moveRight = () => setRomboX((prev) => Math.min(prev + STEP, width - ROMBO_SIZE));

  const resetGame = () => {
    setNubes([]);
    setRomboX(width / 2 - ROMBO_SIZE / 2);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      {!gameOver ? (
        <>
          <View
            style={[
              styles.rombo,
              {
                left: romboX,
                top: height - 150,
              },
            ]}
          />

          {nubes.map((nube, index) => (
            <Text
              key={index}
              style={[
                styles.nube,
                { left: nube.x, top: nube.y },
              ]}
            >
              ☁️
            </Text>
          ))}

          <View style={styles.controls}>
            <TouchableOpacity style={styles.arrowButton} onPress={moveLeft}>
              <Text style={styles.arrowText}>⬅️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowButton} onPress={moveRight}>
              <Text style={styles.arrowText}>➡️</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.gameOver}>
          <Text style={styles.gameOverText}>☁️ GAME OVER ☁️</Text>
          <TouchableOpacity onPress={resetGame} style={styles.restartButton}>
            <Text style={styles.restartText}>🔄 Reiniciar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB",
    justifyContent: "flex-start",
  },
  rombo: {
    position: "absolute",
    width: ROMBO_SIZE,
    height: ROMBO_SIZE,
    backgroundColor: "#FF4500",
    transform: [{ rotate: "45deg" }],
  },
  nube: {
    position: "absolute",
    fontSize: 40,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  arrowButton: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 50,
  },
  arrowText: {
    fontSize: 28,
    color: "#fff",
  },
  gameOver: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 10,
  },
  restartText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
});
