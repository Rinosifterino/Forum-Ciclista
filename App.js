import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Modal
} from 'react-native';

export default function App() {
  const [tela, setTela] = useState('login');
  const [cpf, setCpf] = useState('');
  const [usuario, setUsuario] = useState('');
  const [usuarioInput, setUsuarioInput] = useState(''); // <- Nome digitado no login
  const [senha, setSenha] = useState('');
  const [usuariosLogados, setUsuariosLogados] = useState([]);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [localizacao, setLocalizacao] = useState(null);
  const [mostrarMapaGeral, setMostrarMapaGeral] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState(null);
  
  const formatarCPF = (valor) => {
  valor = valor.replace(/\D/g, ''); // Remove tudo que não é número
  valor = valor.slice(0, 11); // Limita para 11 dígitos

  if (valor.length <= 3) {
    return valor;
  }
  if (valor.length <= 6) {
    return `${valor.slice(0, 3)}.${valor.slice(3)}`;
  }
  if (valor.length <= 9) {
    return `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6)}`;
  }
  return `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6, 9)}-${valor.slice(9, 11)}`;
};

const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11) return false;
  if (/^(.)\1+$/.test(cpf)) return false; // Verifica se todos os dígitos são iguais

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
};

  const obterLocalizacao = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão de localização negada.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocalizacao(location.coords);
    setMostrarMapa(true);
  };

  const [posts, setPosts] = useState([
   {
  id: '1',
  titulo: 'Melhores trilhas em DF',
  autor: 'Carlos',
  mensagem: 'Esta trilha é boa para montain bike?',
  data: new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  likes: 0,
  dislikes: 0,
  comentarios: [
    {
      autor: 'Ana',
      texto: 'Sim! ela é exelente,já fui la diversas vezes',
    }
  ],
  liked: {},
  disliked: {},
  localizacao: {latitude: -15.7215,
        longitude: -47.9982}
},
    {
      id: '2',
      titulo: 'Capacete bom e barato?',
      autor: 'Ana',
      mensagem: 'Qual marca vocês indicam para iniciantes?',
      data: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      likes: 0,
      dislikes: 0,
      comentarios: [],
      liked: {},
      disliked: {}
    },
    {
      id: '3',
      titulo: 'Grupos de ciclistas no DF',
      autor: 'João',
      mensagem: 'Alguem pode me indicar grupos de ciclismo por brasília',
      data: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      likes: 0,
      dislikes: 0,
      comentarios: [],
      liked: {},
      disliked: {}
    }
  ]);
  
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [postSelecionado, setPostSelecionado] = useState(null);
  const [novoComentario, setNovoComentario] = useState('');
  const [mostrarModalPost, setMostrarModalPost] = useState(false);

const fazerLogin = () => {
  if (!usuarioInput || !senha || !cpf) {
    alert('Preencha todos os campos: usuário, senha e CPF.');
    return;
  }

  if (!validarCPF(cpf)) {
    alert('CPF inválido. Verifique e tente novamente.');
    return;
  }

  const usuarioExistente = usuariosLogados.find(u => u.cpf === cpf);

  if (usuarioExistente) {
    // Se o nome não bate com o CPF cadastrado, dá erro
    if (usuarioExistente.nome !== usuarioInput) {
      alert('Este CPF já está cadastrado com outro nome de usuário.');
      return;
    }
    // Se bater, apenas faz login normalmente
    setUsuarioAtual(usuarioExistente);
  } else {
    // CPF não está na lista, então cria novo usuário
    const novoUsuario = {
      nome: usuarioInput,
      cpf,
      senha,
    };
    setUsuariosLogados([...usuariosLogados, novoUsuario]);
    setUsuarioAtual(novoUsuario);
  }

  setTela('forum');
};
const sair = () => {
  setUsuarioAtual(null);
  setTela('login');
};

const removerConta = () => {
  if (usuarioAtual) {
    const atualizados = usuariosLogados.filter(u => u.cpf !== usuarioAtual.cpf);
    setUsuariosLogados(atualizados);
  }
  setUsuarioAtual(null);
  setTela('login');
};
  const adicionarPost = () => {
    if (novoTitulo && novaMensagem) {
      const novo = {
        id: (posts.length + 1).toString(),
        titulo: novoTitulo.slice(0, 50),
        autor: usuarioAtual?.nome || 'Anônimo',
        mensagem: novaMensagem.slice(0, 250),
        data: new Date().toLocaleString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        likes: 0,
        dislikes: 0,
        comentarios: [],
        liked: {},
        disliked: {},
        localizacao: localizacao // localização associada ao post
      };

      setPosts(prev => [novo, ...prev].sort((a, b) => b.likes - a.likes));
      setNovoTitulo('');
      setNovaMensagem('');
      setLocalizacao(null);
      setMostrarModalPost(false);
    }
  };

  const curtirPost = (id, tipo) => {
    const atualizados = posts.map(post => {
      if (post.id === id) {
        const liked = { ...post.liked };
        const disliked = { ...post.disliked };

        let likes = post.likes;
        let dislikes = post.dislikes;

        const jaCurtiu = !!liked[usuarioAtual?.nome];
        const jaDislikou = !!disliked[usuarioAtual?.nome];

        if (tipo === 'like') {
          if (jaCurtiu) {
            delete liked[usuarioAtual?.nome];
            likes--;
          } else {
            liked[usuarioAtual?.nome] = true;
            likes++;
            if (jaDislikou) {
              delete disliked[usuarioAtual?.nome];
              dislikes--;
            }
          }
        } else {
          if (jaDislikou) {
            delete disliked[usuarioAtual?.nome];
            dislikes--;
          } else {
            disliked[usuarioAtual?.nome] = true;
            dislikes++;
            if (jaCurtiu) {
              delete liked[usuarioAtual?.nome];
              likes--;
            }
          }
        }

        return { ...post, liked, disliked, likes, dislikes };
      }
      return post;
    });

    setPosts([...atualizados].sort((a, b) => b.likes - a.likes));
  };

  const comentarPost = () => {
    if (!novoComentario || !postSelecionado) return;
    const atualizados = posts.map(post => {
      if (post.id === postSelecionado.id) {
        const atualizado = {
          ...post,
          comentarios: [...post.comentarios, { autor: usuarioAtual?.nome, texto: novoComentario.slice(0, 250) }]
        };
        setPostSelecionado(atualizado);
        return atualizado;
      }
      return post;
    });
    setPosts(atualizados);
    setNovoComentario('');
  };

  const filtrarPosts = posts.filter(post =>
    post.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
    post.mensagem.toLowerCase().includes(pesquisa.toLowerCase())
  );

  if (tela === 'login') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titulo}>Pedal Cerrado</Text>
        <Image
          source={require('./assets/ciclista.png')}
          style={styles.imageminicial}
        />
      <TextInput
  style={styles.input}
  placeholder="Usuário"
  value={usuarioInput}
  onChangeText={setUsuarioInput}
/>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

   <TextInput
  style={styles.input}
  placeholder="CPF"
  value={cpf}
  onChangeText={(texto) => setCpf(formatarCPF(texto))}
  keyboardType="numeric"
/>
        <TouchableOpacity style={styles.botao} onPress={fazerLogin}>
          <Text style={styles.botaoTexto}>Entrar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cabecalho}>
        <TouchableOpacity onPress={() => setTela(tela === 'perfil' ? 'forum' : 'perfil')} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            style={styles.avatar}
          />
          <Text style={styles.usuarioNome}>{usuarioAtual?.nome || 'Usuário'}</Text>
        </TouchableOpacity>
      </View>

      {tela === 'trocarConta' ? (
  <View>
    <Text style={styles.titulo}>Trocar de Conta</Text>

    {usuariosLogados.length === 0 ? (
      <Text>Nenhum usuário logado.</Text>
    ) : (
      usuariosLogados.map((u, index) => (
        <TouchableOpacity
          key={index}
          style={styles.postagem}
          onPress={() => {
            setUsuarioAtual(u);
            setTela('forum');
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>{u.nome}</Text>
          <Text>CPF: {u.cpf}</Text>
        </TouchableOpacity>
      ))
    )}

    <TouchableOpacity
      style={[styles.botao, { backgroundColor: '#8B0000' }]}
      onPress={() => setTela('forum')}
    >
      <Text style={styles.botaoTexto}>Voltar</Text>
    </TouchableOpacity>
  </View>
)  : tela === 'perfil' ? (
        <View>
          <TouchableOpacity
  style={styles.botao}
  onPress={() => setTela('trocarConta')}
>
  <Text style={styles.botaoTexto}>Trocar de Conta</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.botao}
  onPress={sair}
>
  <Text style={styles.botaoTexto}>Sair da Conta</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.botaoSair}
  onPress={removerConta}
>
  <Text style={styles.botaoTexto}>Remover Conta</Text>
</TouchableOpacity>
        </View>
      ) : postSelecionado ? (
        <View style={styles.postagem}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Text style={styles.postTitulo} numberOfLines={1}>
              {postSelecionado.titulo}
            </Text>
            <TouchableOpacity onPress={() => setPostSelecionado(null)}>
              <Text style={{ fontSize: 20 }}>✖</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.postAutor}>por {postSelecionado.autor} em {postSelecionado.data}</Text>
          <Text>{postSelecionado.mensagem}</Text>

          {postSelecionado.localizacao?.latitude && postSelecionado.localizacao?.longitude && (
            <View style={{ height: 200, marginVertical: 10 }}>
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: postSelecionado.localizacao.latitude,
                  longitude: postSelecionado.localizacao.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker coordinate={postSelecionado.localizacao} title="Local do post" />
              </MapView>
            </View>
          )}

          <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Comentários:</Text>
         {postSelecionado.comentarios.map((c, i) => (
  <View key={i} style={{marginBottom:4}}>
    <Text>- {c.autor}: {c.texto}</Text>
    {c.localizacao && (
      <View style={{ height: 150, marginVertical: 5 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: c.localizacao.latitude,
            longitude: c.localizacao.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={c.localizacao} title="Local do comentário" />
        </MapView>
      </View>
    )}
  </View>
))}
          <TextInput
            style={[styles.input,{height:80}]}
            placeholder="Digite um comentário"
            multiline
            maxLength={250}
            value={novoComentario}
            onChangeText={setNovoComentario}
          />
          <Text style={{ alignSelf: 'flex-end', marginBottom: 5 }}>{novoComentario.length}/250</Text>
          <TouchableOpacity style={styles.botao} onPress={comentarPost}>
            <Text style={styles.botaoTexto}>Comentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Pesquisar no fórum..."
            value={pesquisa}
            onChangeText={setPesquisa}
          />

          <FlatList
            data={filtrarPosts.sort((a, b) => b.likes - a.likes)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const jaCurtiu = !!item.liked[usuarioAtual?.nome];
              const jaDislikou = !!item.disliked[usuarioAtual?.nome];
              return (
                <TouchableOpacity style={styles.postagem} onPress={() => setPostSelecionado(item)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} style={styles.avatar} />
                    <Text style={styles.postAutor}> {item.autor} - {item.data}</Text>
                  </View>
                  <Text style={styles.postTitulo}>{item.titulo}</Text>
                  <Text>{item.mensagem}</Text>

                  {item.localizacao && (
                    <Text style={{ fontStyle: 'italic', fontSize: 12, marginTop: 4 }}>
                      📍 Localização associada ao post
                    </Text>
                  )}

                  <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <TouchableOpacity onPress={() => curtirPost(item.id, 'like')} style={{ marginRight: 10 }}>
                      <Text style={{ color: jaCurtiu ? '#4CAF50' : '#000' }}>🔼 {item.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => curtirPost(item.id, 'dislike')}>
                      <Text style={{ color: jaDislikou ? '#f44336' : '#000' }}>🔽 {item.dislikes}</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}

      {!postSelecionado && tela !== 'perfil' && tela !== 'trocarConta' && tela !== 'login' && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
          <TouchableOpacity onPress={() => setMostrarModalPost(true)}>
            <Text style={{ fontSize: 24 }}>➕</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMostrarMapaGeral(true)}>
          <Text style={{ fontSize: 24 }}>📍</Text>
          </TouchableOpacity>
        </View>
      )}

      {mostrarMapa && localizacao && (
        <>
          <View style={{ flex: 1, height: 300, borderRadius: 10, overflow: 'hidden', marginVertical: 10 }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: localizacao.latitude,
                longitude: localizacao.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: localizacao.latitude,
                  longitude: localizacao.longitude,
                }}
                title="Você está aqui"
              />
            </MapView>
          </View>

          <TouchableOpacity
            style={[styles.botao, { backgroundColor: '#8B0000', marginTop: 10 }]}
            onPress={() => setMostrarMapa(false)}
          >
            <Text style={styles.botaoTexto}>Fechar Mapa</Text>
          </TouchableOpacity>
        </>
      )}

<Modal visible={mostrarModalPost} animationType="slide">
  <SafeAreaView style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder="Título do tópico"
      value={novoTitulo}
      maxLength={50}
      onChangeText={setNovoTitulo}
    />
    <Text style={{ alignSelf: 'flex-end', marginBottom: 5 }}>{novoTitulo.length}/50</Text>

    <TextInput
      style={[styles.input, { height: 80 }]}
      placeholder="Mensagem"
      multiline
      maxLength={250}
      value={novaMensagem}
      onChangeText={setNovaMensagem}
    />
    <Text style={{ alignSelf: 'flex-end', marginBottom: 5 }}>{novaMensagem.length}/250</Text>

    {/* Botão para obter localização dentro do modal */}
    <TouchableOpacity style={[styles.botao, { backgroundColor: '#007AFF' }]} onPress={obterLocalizacao}>
      <Text style={styles.botaoTexto}>📍 Anexar Localização</Text>
    </TouchableOpacity>

    {/* Indicação de que a localização foi carregada */}
    {localizacao && (
      <Text style={{ color: 'green', marginBottom: 10 }}>✅ Localização vinculada ao post</Text>
    )}

    <TouchableOpacity style={styles.botao} onPress={adicionarPost}>
      <Text style={styles.botaoTexto}>Postar</Text>
    </TouchableOpacity>

    <TouchableOpacity style={[styles.botao, { backgroundColor: '#888' }]} onPress={() => setMostrarModalPost(false)}>
      <Text style={styles.botaoTexto}>Cancelar</Text>
    </TouchableOpacity>
  </SafeAreaView>
</Modal>

{mostrarMapaGeral && (
  <Modal visible={mostrarMapaGeral} animationType="slide">
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: posts.find(p => p.localizacao)?.localizacao.latitude || -15.793889,
          longitude: posts.find(p => p.localizacao)?.localizacao.longitude || -47.882778,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {posts.filter(p => p.localizacao).map(post => (
          <Marker
            key={post.id}
            coordinate={post.localizacao}
            title={post.titulo}
            description={"por " + post.autor}
          />
        ))}
      </MapView>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: '#8B0000', margin: 16 }]}
        onPress={() => setMostrarMapaGeral(false)}
      >
        <Text style={styles.botaoTexto}>Fechar Mapa</Text>
      </TouchableOpacity>
    </SafeAreaView>
  </Modal>
)}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5'
  },
  cabecalho: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10
  },
  usuarioNome: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#CCC',
    borderWidth: 1
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  botaoTexto: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  postagem: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#DDD',
    borderWidth: 1
  },
  postTitulo: {
    fontWeight: 'bold',
    fontSize: 16
  },
  postAutor: {
    color: '#555',
    fontSize: 12,
    marginBottom: 4
  },
  imageminicial:{
    width: 300,
    height: 268,
    alignSelf: 'center',
    marginBottom:10
  },
  botaoSair: {
    backgroundColor: '#8B0000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  }
});